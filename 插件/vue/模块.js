import { loadModule } from './vue3-sfc-loader.esm.js'
export default class 模块 {
    static 界面目录 = './界面/';
    static 获取配置() {
        return {
            moduleCache: {
                vue: Vue,
            },
            async getFile(url) {
                var 请求地址 = 模块.界面目录 + url;
                const res = await fetch(请求地址);
                if (!res.ok) {
                    console.error("加载失败: ", res.url);
                    throw Object.assign(new Error(url + ' ' + res.statusText), { res });
                }
                var resText = await res.text();
                return resText;
            },
            addStyle(textContent) {
                const style = Object.assign(document.createElement('style'), { textContent });
                const ref = document.head.getElementsByTagName('style')[0] || null;
                document.head.insertBefore(style, ref);
            },

            log(type, ...args) {
                console[type](...args);
            },
            // compiledCache: {
            //     set(key, str) {
            //         // window.localStorage.setItem(key, str);
            //     },
            //     get(key) {
            //         return window.localStorage.getItem(key);
            //     },
            // },
            async handleModule(type, source, path, options) {
                if (type === '.json') {
                    return JSON.parse(await source());
                }
                if (type === '.ini') {
                    return await source();
                }
            }
        }
    }

    static 异步加载(路径) {
        路径 += '.vue';
        try {
            return Vue.defineAsyncComponent(() => loadModule(路径, 模块.获取配置()));
        } catch (e) {
            console.error("加载模块出错: ", e);
        }

    }

}