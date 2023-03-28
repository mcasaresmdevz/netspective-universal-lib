import { visit } from 'unist-util-visit';
import YAML from 'yaml';
import { z } from 'zod';
export const chartJsSchema = z.object({
    canvas: z.object({
        id: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
    }).optional(),
    type: z.string(),
    data: z.record(z.string(), z.unknown())
});
function emitChartJs(original, vfile) {
    var _a, _b;
    const vfd = vfile.data;
    let chartJsPluginState = { index: 0 };
    if (!vfd.chartJsPluginState) {
        vfd.chartJsPluginState = chartJsPluginState;
    }
    else {
        chartJsPluginState = vfd.chartJsPluginState;
    }
    const node = original;
    node.type = 'html';
    let pluginConfig;
    let chartJsCanvasConfig;
    try {
        chartJsCanvasConfig = YAML.parse(original.value);
        pluginConfig = chartJsSchema.parse(chartJsCanvasConfig);
    }
    catch (err) {
        node.value = `<div>Error parsing Chart.js configuration: ${err}</div>`;
        return;
    }
    chartJsPluginState.index++;
    const elemID = (_b = (_a = pluginConfig.canvas) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : `chart-js-${chartJsPluginState.index}`;
    node.value = `
		<canvas id="${elemID}" class="chart-js"></canvas>
		<script>
			(() => {
				const render = () => {
					const canvas = document.querySelector("#${elemID}");
					const chart = new Chart(canvas, ${JSON.stringify(chartJsCanvasConfig, null, "  ")});
					this.onclick = (evt) => {
						const points = chart.getElementsAtEventForMode(evt, "nearest", {
							intersect: true,
						}, true);
						if (points.length) {
							const firstPoint = points[0];
							const data = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
							if (("navigation" in data) && data.navigation) window.location = data.navigation.url;
							if (("url" in data) && data.url) window.location = data.url;
						}
					};
				}

				if ("Chart" in window) {
					render();
				} else {
					const scriptElem = document.createElement('script');
					scriptElem.onload = render;
					scriptElem.type = 'text/javascript';
					scriptElem.src = "https://cdn.jsdelivr.net/npm/chart.js";
					document.head.appendChild(scriptElem);
				}		
			})()
		</script>`;
}
export const apacheEChartsPluginSchema = z.object({
    canvas: z.object({
        id: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
    }).optional(),
});
function emitApacheECharts(original, vfile) {
    var _a, _b, _c, _d, _e, _f;
    const vfd = vfile.data;
    let apacheEChartsPluginState = { index: 0 };
    if (!vfd.apacheEChartsPluginState) {
        vfd.apacheEChartsPluginState = apacheEChartsPluginState;
    }
    else {
        apacheEChartsPluginState = vfd.apacheEChartsPluginState;
    }
    const node = original;
    node.type = 'html';
    let pluginConfig;
    let echartsConfig;
    try {
        echartsConfig = YAML.parse(original.value);
        pluginConfig = apacheEChartsPluginSchema.parse(echartsConfig);
    }
    catch (err) {
        node.value = `<div>Error parsing Apache ECharts configuration: ${err}</div>`;
        return;
    }
    apacheEChartsPluginState.index++;
    const elemID = (_b = (_a = pluginConfig.canvas) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : `apache-echarts-${apacheEChartsPluginState.index}`;
    node.value = `
		<div id="${elemID}" class="apache-echarts" style="width: ${(_d = (_c = pluginConfig.canvas) === null || _c === void 0 ? void 0 : _c.width) !== null && _d !== void 0 ? _d : 800}px; height: ${(_f = (_e = pluginConfig.canvas) === null || _e === void 0 ? void 0 : _e.height) !== null && _f !== void 0 ? _f : 600}px;"></div>
		<script>
			(() => {
				const render = () => {
					const chart = echarts.init(document.getElementById("${elemID}"));
					console.dir({chart})
					chart.setOption(${JSON.stringify(echartsConfig, null, "  ")});
					chart.on("click", ({ data }) => {
						if (("navigation" in data) && data.navigation) {
							window.location = data.navigation.url;
						}
						if (("url" in data) && data.url) {
							window.location = data.url;
						}
					});
					window.addEventListener("resize", () => {
						chart.resize();
					});
				}

				if ("echarts" in window) {
					render();
				} else {
					const scriptElem = document.createElement('script');
					scriptElem.onload = render;
					scriptElem.type = 'text/javascript';
					scriptElem.src = "https://cdn.jsdelivr.net/npm/echarts@5.1.2/dist/echarts.min.js";
					document.head.appendChild(scriptElem);
				}		
			})()
		</script>`;
}
export function remarkPlugin() {
    return function transformer(tree, vfile, next) {
        visit(tree, 'code', (node) => {
            switch (node.lang) {
                case 'chartjs':
                    emitChartJs(node, vfile);
                    break;
                case 'apache-echarts':
                case 'echarts':
                    emitApacheECharts(node, vfile);
                    break;
            }
        });
        if (typeof next === 'function') {
            return next(null, tree, vfile);
        }
        return tree;
    };
}
//# sourceMappingURL=remark-chart.js.map