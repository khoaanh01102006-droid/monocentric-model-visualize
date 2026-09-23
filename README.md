# Urban Economics: the monocentric city

**[Open the material](https://khoaanh01102006-droid.github.io/monocentric-model-visualize/)** — five lessons, in English and Vietnamese.

Teaching material on the Alonso–Muth–Mills model, written to be stepped through in a
classroom. The model is set out first in the notation of Brueckner (2011), then taken
outside and measured against one city: how far land prices really fall with distance from
the centre, where Ho Chi Minh City really ends when population decides the boundary instead
of the provincial line, what a new bridge did to the journey into the centre, and how the
city stands beside Hanoi, Bangkok, Jakarta, Manila and Kuala Lumpur.

Where the measurements disagree with the model, or with a published claim, the lesson says
so and shows the working. Several of them do.

## The lessons

**1. [The monocentric city model](https://khoaanh01102006-droid.github.io/monocentric-model-visualize/en/1-model.html)** — Assumptions, the condition that makes households indifferent between locations, developers’ choice of building height, the edge of the city, and comparative statics.

**2. [Testing the model in Ho Chi Minh City](https://khoaanh01102006-droid.github.io/monocentric-model-visualize/en/2-hcmc.html)** — Land prices set by the city and population density on a 1 km grid; where the city ends when it is measured with population data rather than with its administrative boundary; how the estimated gradients depend on choices of measurement; the city placed among 192 cities; and the two features the model does not describe.

**3. [When commuting becomes cheaper](https://khoaanh01102006-droid.github.io/monocentric-model-visualize/en/3-commuting.html)** — What the commuting cost of the model stands for in a real city; the motorcycle, and what the sources report about vehicles and speeds; the bridges, tunnel and expressways opened since 2008, and a model of the road network that measures how each changed the time to Ben Thanh, by motorcycle and by car; and public transport, including Metro Line 1.

**4. [Ho Chi Minh City among its neighbours](https://khoaanh01102006-droid.github.io/monocentric-model-visualize/en/4-neighbours.html)** — Ho Chi Minh City beside Hanoi, Bangkok, Jakarta, Manila and Kuala Lumpur, all measured with the urban centre of the Global Human Settlement Layer: size, density and growth since 1990. A closer comparison of Hanoi and Ho Chi Minh City tests two statements of the World Bank against satellite data.

**5. [How urban is Vietnam?](https://khoaanh01102006-droid.github.io/monocentric-model-visualize/en/5-urbanisation.html)** — The official definition of urban areas, the international Degree of Urbanisation and the lights that satellites see at night give very different answers. The lesson maps where they disagree and re-examines the evidence the World Bank used in 2020.

## How it is built

Four rules are enforced by `kiem.mjs` in the working project; breaking one breaks the build
rather than producing a page:

1. Every dataset carries its provenance — source, licence, date of access, and the script
   that produced the file. A figure whose data lacks any of these refuses to load.
2. No number in the prose is typed by hand. Results are injected from the data files, so a
   sentence cannot drift away from the measurement behind it.
3. Model and measurement are drawn differently — dashed for what the model says, solid and
   dotted for what was measured, a heavy dark dash for a fit to data.
4. Only sources whose licence allows classroom distribution, and every quotation is checked
   word for word against the source PDF before it can appear.

The maps are not decoration: each one is drawn from the grid or the network the lesson is
arguing about, and every figure has a plain-language panel saying where its data came from
and what it will not support.

## Data

The 22 datasets behind the figures are listed in [NOTICE.md](NOTICE.md) with their
citations and licences — population and built-up grids from the European Commission's Global
Human Settlement Layer, road networks from OpenStreetMap, Vietnamese land-price schedules as
issued by the state, World Development Indicators, and the harmonised night-lights series.
Everything is public and openly licensed; nothing here is confidential.

## Running it

This repository is built output: plain HTML, CSS and JavaScript with the data as script
files, and the libraries and fonts alongside them. There is no build step and no package to
install — clone it and open `index.html`, or serve the folder. Only the grey base map behind
the data comes from the network; without it the data, the place names and the distance rings
still draw.

Edits belong in the working project, which generates this folder; changes made here are
overwritten on the next build.

## Tiếng Việt

Trang có đủ bản tiếng Việt: [1. Mô hình thành phố đơn tâm](https://khoaanh01102006-droid.github.io/monocentric-model-visualize/vi/1-model.html) · [2. Kiểm mô hình ở TP.HCM](https://khoaanh01102006-droid.github.io/monocentric-model-visualize/vi/2-hcmc.html) · [3. Khi đi lại rẻ hơn](https://khoaanh01102006-droid.github.io/monocentric-model-visualize/vi/3-commuting.html) · [4. TP.HCM giữa các đô thị láng giềng](https://khoaanh01102006-droid.github.io/monocentric-model-visualize/vi/4-neighbours.html) · [5. Việt Nam đô thị hoá đến đâu?](https://khoaanh01102006-droid.github.io/monocentric-model-visualize/vi/5-urbanisation.html).

Bản gốc viết bằng tiếng Anh; thuật ngữ trong bản tiếng Việt theo bản dịch chính thức của
Ngân hàng Thế giới cho hai báo cáo đô thị hoá Việt Nam, để lời giảng khớp với tài liệu mà
người học sẽ đọc tiếp. Tài liệu giảng dạy phi thương mại.
