<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { assetApi } from './api'

const CATEGORIES = ['Consumable', 'Non-Consumable']
const assets = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const formError = ref('')
const search = ref('')
const showForm = ref(false)
const editingId = ref(null)
const form = reactive({ asset_name: '', stock_quantity: 0, category: 'Consumable' })

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return q ? assets.value.filter(a => a.asset_name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)) : assets.value
})

async function loadAssets() {
  loading.value = true; error.value = ''
  try { assets.value = await assetApi.list() }
  catch (e) { error.value = `Gagal memuat data: ${e.message}. Pastikan API NestJS berjalan.` }
  finally { loading.value = false }
}

function openCreate() {
  editingId.value = null
  Object.assign(form, { asset_name: '', stock_quantity: 0, category: 'Consumable' })
  formError.value = ''; showForm.value = true
}

function openEdit(a) {
  editingId.value = a.asset_id
  Object.assign(form, { asset_name: a.asset_name, stock_quantity: a.stock_quantity, category: a.category })
  formError.value = ''; showForm.value = true
}

async function save() {
  formError.value = ''
  const payload = { asset_name: form.asset_name.trim(), stock_quantity: Number(form.stock_quantity), category: form.category }
  if (!payload.asset_name) { formError.value = 'Nama asset wajib diisi'; return }
  if (!Number.isInteger(payload.stock_quantity) || payload.stock_quantity < 0) { formError.value = 'Stok harus bilangan bulat ≥ 0'; return }
  saving.value = true
  try {
    editingId.value !== null ? await assetApi.update(editingId.value, payload) : await assetApi.create(payload)
    showForm.value = false
    await loadAssets()
  } catch (e) { formError.value = e.message }
  finally { saving.value = false }
}

async function remove(a) {
  if (!confirm(`Hapus asset "${a.asset_name}"?`)) return
  try { await assetApi.remove(a.asset_id); await loadAssets() }
  catch (e) { error.value = `Gagal menghapus: ${e.message}` }
}

onMounted(loadAssets)
</script>

<template>
  <main class="page">
    <header class="top">
      <h1>Asset Fumindo</h1>
      <button class="btn primary" @click="openCreate">+ Tambah Asset</button>
    </header>

    <input v-model="search" class="input" type="search" placeholder="Cari nama atau kategori…" />
    <p v-if="error" class="alert">{{ error }}</p>

    <table>
      <thead>
        <tr><th>ID</th><th>Nama Asset</th><th>Stok</th><th>Kategori</th><th>Aksi</th></tr>
      </thead>
      <tbody>
        <tr v-if="loading"><td colspan="5" class="empty">Memuat data…</td></tr>
        <tr v-else-if="!filtered.length"><td colspan="5" class="empty">Belum ada data asset.</td></tr>
        <tr v-for="a in filtered" :key="a.asset_id">
          <td>{{ a.asset_id }}</td>
          <td>{{ a.asset_name }}</td>
          <td>{{ a.stock_quantity }}</td>
          <td>{{ a.category }}</td>
          <td>
            <button class="btn" @click="openEdit(a)">Edit</button>
            <button class="btn danger" @click="remove(a)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="overlay" @click.self="showForm = false">
      <form class="modal" @submit.prevent="save">
        <h2>{{ editingId !== null ? 'Edit Asset' : 'Tambah Asset' }}</h2>
        <label>Nama Asset <input v-model="form.asset_name" class="input" maxlength="150" required /></label>
        <label>Jumlah Stok <input v-model.number="form.stock_quantity" class="input" type="number" min="0" step="1" required /></label>
        <label>Kategori
          <select v-model="form.category" class="input">
            <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
        <p v-if="formError" class="alert">{{ formError }}</p>
        <div class="actions">
          <button type="button" class="btn" @click="showForm = false">Batal</button>
          <button type="submit" class="btn primary" :disabled="saving">{{ saving ? 'Menyimpan…' : 'Simpan' }}</button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
.page { max-width: 860px; margin: 0 auto; padding: 24px 16px; font-family: system-ui, sans-serif; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
table { width: 100%; border-collapse: collapse; margin-top: 12px; }
th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e3e8ee; }
.empty { text-align: center; color: #6b7684; }
.input { width: 100%; padding: 8px 10px; border: 1px solid #cfd6df; border-radius: 6px; font: inherit; box-sizing: border-box; }
.btn { padding: 6px 12px; margin-left: 6px; border: 1px solid #cfd6df; border-radius: 6px; background: #fff; cursor: pointer; font: inherit; }
.btn.primary { background: #2563eb; border-color: #2563eb; color: #fff; }
.btn.danger { color: #d92d20; border-color: #f3c7c3; }
.alert { padding: 8px 10px; background: #fdecea; color: #912018; border-radius: 6px; }
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; padding: 24px; border-radius: 10px; width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 12px; }
.modal label { display: flex; flex-direction: column; gap: 4px; font-weight: 600; }
.actions { display: flex; justify-content: flex-end; }
</style>