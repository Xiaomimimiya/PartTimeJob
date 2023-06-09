import HtmlToJson from "./utils/html2json";
import showdown from "./utils/showdown.js";
import {
    getSystemInfo,
    cacheInstance,
    getUniqueKey
} from "./utils/util";
const BIND_NAME = "wxParse";
Component({
    properties: {
        pageKey: {
            type: String,
            value: ""
        },
        rootKey: {
            type: String,
            value: ""
        },
        language: {
            type: String,
            value: "html"
        },
        nodes: {
            type: null,
            observer(e) {
                if (!e) return;
                const {
                    language: t
                } = this.properties;
                if ("markdown" === t || "md" === t) {
                    const t = (new showdown.Converter).makeHtml(e);
                    setTimeout(() => {
                        this._parseNodes(t)
                    }, 0)
                } else setTimeout(() => {
                    this._parseNodes(e)
                }, 0)
            }
        }
    },
    data: {
        pageNodeKey: "",
        wxparseRootKey: "",
        nodesData: [],
        bindData: {}
    },
    lifetimes: {
        detached() {
            cacheInstance.removeAllByKey(this.data.pageKey)
        }
    },
    methods: {
        _parseNodes(e) {
            if ("string" == typeof e) this._parseHtml(e);
            else {
                const t = "[object Array]" === Object.prototype.toString.call(e) ? e : [e];
                this.setData({
                    nodesData: t
                })
            }
        },
        _parseHtml(e) {
            const t = getCurrentPages(),
                a = "wxParse_" + t[t.length - 1].__wxExparserNodeId__,
                s = `${a}_${getUniqueKey()}`,
                o = HtmlToJson.html2json(e, s);
            o.view = {}, o.view.imagePadding = 0, this.setData({
                wxparseRootKey: s,
                pageNodeKey: a,
                nodesData: o.nodes,
                bindData: {
                    [s]: o
                }
            });
            const n = cacheInstance.get(a);
            n ? n.push(s) : cacheInstance.set(a, [s]), cacheInstance.set(s, o)
        },
        wxParseImgLoad(e) {
            const {
                from: t,
                index: a
            } = e.target.dataset || {};
            if (void 0 !== t && t.length > 0) {
                const {
                    width: t,
                    height: a
                } = e.detail, s = this._wxAutoImageCal(t, a);
                this.setData({
                    width: s.imageWidth,
                    height: s.imageHeight
                })
            }
        },
        wxParseImgTap(e) {
            const {
                src: t = "",
                from: a = ""
            } = e.target.dataset || {}, s = this.data.rootKey || this.data.wxparseRootKey || a, {
                imageUrls: o = []
            } = cacheInstance.get(s) || {};
            wx.previewImage({
                current: t,
                urls: o
            })
        },
        _wxAutoImageCal(e, t) {
            let a = 0,
                s = 0;
            const o = {},
                [n, i] = getSystemInfo();
            return e > n ? (a = n, s = a * t / e, o.imageWidth = a, o.imageHeight = s) : (o.imageWidth = e, o.imageHeight = t), o
        },
        wxParseTagATap(e) {
            const {
                src: t = ""
            } = e.currentTarget.dataset, a = getCurrentPages(), s = a[a.length - 1];
            if (s && s.handleTagATap) return void s.handleTagATap(t); - 1 === t.indexOf("http") ? wx.navigateTo({
                url: t
            }) : wx.navigateTo({
                url: "/components/wxParse/webviewPage/webviewPage?src=" + t
            })
        }
    }
});