# Placeholder UI
> A simple fast free jQrony image/video user interface placeholder plugin

## Install npm
```bash
# install locally (recommended)
npm install placeholder-ui --dev
```

## How to build placeholder-ui
```bash
git clone git://github.com/jqrony/placeholder-ui.git
```
## Plugin Setup

### Step 1
#### Implement jQrony in HTML head section
```html
<script src="https://jqrony.github.io/jqrony/dist/jqrony-min.js"></script>
```

### Step 2
#### Implement placeholder-ui plugin in head section
```html
<script src="root/dir/jqrony.placeholder-min.js"></script>
<!-- or -->
<script src="https://jqrony.github.io/placeholder-ui/jqrony.placeholder.min.js"></script>
```

## Usage
```js
// Usage
// Method: 1
$("img:eq(0)").placeholder();

// Method: 2
$("img:eq(1)").placeholder({
	sizePreview: true
});

// Method: 3
$("img:eq(2)").placeholder({
	color: "#2929d5"
});

// Method: 4
$("img:eq(3)").placeholder({
	sizePreview: true,
	color: "#d5d516",
	background: "#555555"
});

// Method: 5
$("img:eq(4)").placeholder({
	fontFamily: "monospace",
	color: "#ffffff",
	fontSize: 22,
	fontStyle: "italic",
	fontWeight: 900,
	background: "#2929d5"
});
```