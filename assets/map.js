/* Urban Economics (V2) · maps.

   Cartographic conventions taken from World Bank publications (Vietnam Urbanization Review
   2011, Fig. 3.25; Vietnam's Urbanization at a Crossroads, Maps O.1–O.2):
   flat 2D map, north up (rotation and pitch are disabled), no imagery, pale land and water,
   classed colours with a boxed legend, a few bold place names, distance rings, a scale bar,
   and Source / Note lines under the map (written in the page, not here).

   The base layer (water, main roads) comes from OpenFreeMap vector tiles. Everything that
   carries meaning — data, rings, place names, legend — is drawn locally, so it still shows
   when the classroom has no internet. */
(function () {
  'use strict';
  const K = window.KTDT;
  const BASE_BG = '#F2F3F5', WATER = '#D5E1EA';

  function baseStyle() {
    return {
      version: 8,
      sources: { omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' } },
      layers: [
        { id: 'bg', type: 'background', paint: { 'background-color': BASE_BG } },
        { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': WATER } },
        { id: 'roads', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 7,
          filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary']]],
          paint: { 'line-color': '#FFFFFF', 'line-width': ['interpolate', ['linear'], ['zoom'], 7, 0.4, 12, 1.8] } },
        { id: 'admin', type: 'line', source: 'omt', 'source-layer': 'boundary', filter: ['all', ['<=', ['get', 'admin_level'], 4], ['!=', ['get', 'maritime'], 1]],
          paint: { 'line-color': '#8A969F', 'line-width': 0.9, 'line-dasharray': [3, 2] } },
      ],
    };
  }

  K.map = function (container, o) {
    if (!window.maplibregl) throw new Error('MapLibre not loaded');
    const map = new maplibregl.Map({
      container, style: baseStyle(), center: o.center, zoom: o.zoom, minZoom: o.minZoom ?? 6, maxZoom: o.maxZoom ?? 14,
      dragRotate: false, pitchWithRotate: false, touchPitch: false, maxPitch: 0, attributionControl: false,
      fadeDuration: 0,
    });
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();
    map.scrollZoom.disable();                       // the page scrolls; zoom with the buttons or double-click
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    if (window.ResizeObserver) new ResizeObserver(() => map.resize()).observe(map.getContainer());
    map.on('error', (e) => { if (!/tiles\.openfreemap|Failed to fetch/.test(String(e.error && e.error.message))) console.warn(e.error); });
    return map;
  };

  /* after data layers: redraw water and main roads on top so rivers cut through the data */
  K.mapTopLayers = function (map) {
    map.addLayer({ id: 'water-top', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': WATER } });
    map.addLayer({ id: 'roads-top', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 8,
      filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk']]],
      paint: { 'line-color': '#FFFFFF', 'line-opacity': 0.75, 'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 12, 1.6] } });
  };

  /* step colour expression from class breaks */
  K.stepColor = function (prop, breaks, colors, noData) {
    const e = ['step', ['get', prop], colors[0]];
    breaks.forEach((b, i) => e.push(b, colors[i + 1]));
    return noData ? ['case', ['==', ['get', prop], null], noData, e] : e;
  };
  K.classOf = function (v, breaks) { let i = 0; while (i < breaks.length && v >= breaks[i]) i++; return i; };

  K.mapChoropleth = function (map, o) {
    map.addSource(o.id, { type: 'geojson', data: o.data, generateId: true });
    map.addLayer({ id: o.id + '-fill', type: 'fill', source: o.id, paint: { 'fill-color': K.stepColor(o.prop, o.breaks, o.colors, '#CED4DE'), 'fill-opacity': o.opacity ?? 1 } });
    map.addLayer({ id: o.id + '-line', type: 'line', source: o.id, paint: { 'line-color': o.lineColor || '#FFFFFF', 'line-width': o.lineWidth ?? 0.5 } });
    map.addLayer({ id: o.id + '-hover', type: 'line', source: o.id, paint: { 'line-color': '#111111', 'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 2.2, 0] } });
    if (o.tip) K.mapTip(map, o.id + '-fill', o.id, o.tip);
  };

  K.mapTip = function (map, layer, source, html) {
    const box = map.getContainer();
    const tip = document.createElement('div'); tip.className = 'tip'; tip.style.display = 'none'; box.appendChild(tip);
    let cur = null;
    map.on('mousemove', layer, (e) => {
      const f = e.features[0]; if (!f) return;
      if (cur !== null && source) map.setFeatureState({ source, id: cur }, { hover: false });
      cur = f.id; if (source && cur != null) map.setFeatureState({ source, id: cur }, { hover: true });
      map.getCanvas().style.cursor = 'default';
      tip.innerHTML = html(f.properties);
      tip.style.display = 'block';
      const w = tip.offsetWidth, W = box.clientWidth;
      tip.style.left = Math.min(W - w - 6, e.point.x + 14) + 'px';
      tip.style.top = Math.max(4, e.point.y - 52) + 'px';
    });
    map.on('mouseleave', layer, () => { tip.style.display = 'none'; if (cur !== null && source) map.setFeatureState({ source, id: cur }, { hover: false }); cur = null; });
  };

  /* circle as a lon/lat ring (equirectangular approximation, exact enough within 100 km) */
  K.circle = function (center, km, n) {
    const kmLat = 110.574, kmLon = 111.32 * Math.cos(center[1] * Math.PI / 180), a = [];
    for (let k = 0; k <= (n || 128); k++) { const g = 2 * Math.PI * k / (n || 128); a.push([center[0] + km / kmLon * Math.sin(g), center[1] + km / kmLat * Math.cos(g)]); }
    return a;
  };

  K.mapRings = function (map, id, center, radii, label, goc) {
    map.addSource(id, { type: 'geojson', data: { type: 'FeatureCollection', features: radii.map((r) => ({ type: 'Feature', properties: { r }, geometry: { type: 'LineString', coordinates: K.circle(center, r) } })) } });
    map.addLayer({ id, type: 'line', source: id, paint: { 'line-color': '#111111', 'line-opacity': 0.55, 'line-width': 0.8, 'line-dasharray': [4, 3] } });
    const kmLat = 110.574, kmLon = 111.32 * Math.cos(center[1] * Math.PI / 180);
    return radii.map((r) => {
      const d = document.createElement('div'); d.className = 'ring-label'; d.textContent = label(r);
      const g = goc != null ? goc : Math.PI / 4;   // default: north-east of each ring
      return new maplibregl.Marker({ element: d, anchor: 'bottom-left' }).setLngLat([center[0] + r / kmLon * Math.sin(g), center[1] + r / kmLat * Math.cos(g)]).addTo(map);
    });
  };

  K.mapPlaces = function (map, places) {
    return places.map((p) => {
      const d = document.createElement('div'); d.className = 'place' + (p.minor ? ' minor' : '');
      d.innerHTML = (p.dot ? '<span class="dot"></span>' : '') + p.name;
      return new maplibregl.Marker({ element: d, anchor: p.anchor || 'left', offset: p.dot ? [-4, 0] : [0, 0] }).setLngLat(p.at).addTo(map);
    });
  };

  /* binned legend, World Bank style: 10 px bins, 0.5 px border, values at the class breaks */
  K.legendBins = function (host, o) {
    const box = document.createElement('div'); box.className = 'legend' + (o.outside ? ' outside' : '');
    const n = o.colors.length, w = o.binWidth || (host.clientWidth < 560 ? 38 : 50);
    box.innerHTML = '<div class="t">' + o.title + '</div><div class="bins">' +
      o.colors.map((c) => '<i style="background:' + c + ';width:' + w + 'px"></i>').join('') + '</div><div class="ticks" style="width:' + (n * w) + 'px">' +
      o.breaks.map((b, i) => '<span style="left:' + ((i + 1) * w) + 'px">' + o.fmt(b) + '</span>').join('') + '</div>' + (o.extra || '');
    host.appendChild(box);
    return box;
  };
})();
