import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'



// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: ['vue', 'vue-router'],
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    prefix: 'Icon'
                }),
            ],
        }),
        Components({
            resolvers: [ElementPlusResolver(),
            IconsResolver({
                enabledCollections: ['ep'],
            })
            ],
        }),
        Icons({
            autoInstall: true
        })
    ],
    server: {
        host: '0.0.0.0',
        port: 8000
    }
})
