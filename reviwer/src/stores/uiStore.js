import create from 'zustand'
import { persist } from 'zustand/middleware'

const useUiStore = create(persist((set) => ({
  currentPage: 'home',
  setPage: (p) => set({ currentPage: p }),
  modalOpen: false,
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false })
}), { name: 'reviwer_ui' }))

export default useUiStore

