// vite.config.ts

import { fileURLToPath, URL } from 'node:url' //★
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa' //★

export default defineConfig({
  // GitHub Pagesなどでサブディレクトリに公開する場合、リポジトリ名を設定
  // 例: https://<USERNAME>.github.io/sudoku/ -> /sudoku/
  base: '/luckylotto/', 
  
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate', // 更新があった場合に自動でリロードする
      devOptions: {
        enabled: true // 開発モードでもPWAの動作確認を可能にする
      },
      manifest: {
        id: '/luckylotto/',
        name: 'Numbers4&lott6シミュレータ', // アプリのフルネーム
        short_name: 'N2＆L6アプリ', // ホーム画面に表示される短い名前
        description: 'ナンバーズ４とロト6のシミュレータゲームです。', // アプリの説明
        start_url: '/luckylotto/', // アプリ起動時のURL
        display: 'standalone', // アドレスバーなどを表示しないネイティブアプリのような表示
        background_color: '#ffffff', // スプラッシュ画面の背景色
        theme_color: '#007acc',      // ツールバーの色
        icons: [
          {
            src: 'icon-192x192.png', // publicディレクトリからの相対パス
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png', // publicディレクトリからの相対パス
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  // ビルド時に'@'を'src'として解決するための設定
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
