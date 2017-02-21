# 注意：基础zepto.js 不具备scroll

# $.scroll

### 用js 创建一个滚动区域


## html
```html
	<div class="scroll">
		<div class="scrolling">
			<div>滚动内容</div>
		</div>
	</div>
```



## html [大list]
```html
	<div class="scroll">
		<div class="scrolling">
			<section>...</section>
			<section>...</section>
			<section>...</section>
			<section>...</section>
			<section>...</section>
			<section>...</section>
			<section>...</section>
			<section>...</section>
			<section>...</section>
			<section>...</section>
		</div>
	</div>
```



## css [Y - fullscreen]

```css
	.scroll {
		position: fixed;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    z-index: 1;
	    overflow: hidden;
	}
	.scrolling {
		position: absolute;
	    z-index: 1;
	    min-width: 100%;
	}
```



## css [X]

```css
	.scroll {
		display: flex;
		position: fixed;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    z-index: 1;
	    overflow: hidden;
	}
	.scrolling {
		display: flex;
	    position: absolute;
    	z-index: 1;
	}
```



## css[infinite] section 为每一个替换模型
```css
	scrolling section {
		transform: translate(0px, -100%) translateZ(0px)
	}
```



## javascript

```js
	$('.scroll').scroll({

		// 设定默认起始位置

		startX : 0,
		startY : 0,

		// 启用横向滚动

		scrollX : false,

		// 启用竖向滚动

		scrollY : true,


		// 滚动条选项

		scrollbars : true,


		// 边缘弹性

		bounce : true,

		// 阻力倍数

		bounceDrag : 3,

		// 动画时间

		bounceTime : 400,

		// 动画曲线

		bounceEasing : '',

		// 边缘最大弹性边距系数

		boundariesLimit : 0.6,

		// 惯性时阻止弹性

		bounceBreakThrough : true,


		snap : false,
		snapSpeed : 400,
		snapEasing : '',
		snapThreshold : 0.15,

		preventDefault: true,



		// 惯性

		momentum : true,

		// 惯性系数

		deceleration : 0.0012,

		// 最大惯性速度

		speedLimit : 3,


		// 大list高性能滚动项

		infiniteElements: elements,
		deceleration: 0.003,

		// 循环数据最低cache数量

		infiniteCacheBuffer : 50,

		

		// 延迟加载

		infiniteDeferLoad : false,

		
		// 等高item 设定，否则false 

		infiniteItemSize: 100,


		// 获取滚动的数据方法， 当缓存数据不足时执行

		getInfiniteDataset: function (start, callback) {
			var page = Math.ceil(start / dataLimit)

			// 常用变量
		
            // page : page,
            // start : start,
            // limit : dataLimit

            // this.infiniteDataLength

            // 更新更多数据 getData
            getData(data ,function (dataRows) {
            	
            	// 成功取回数据

            	callback(dataRows, dataRows.length < dataLimit ? true : false)  // 第二个参数数据是否结束 true ／ false
            })
      
		},



		// 滚动时模版移入移出操作

		getInfiniteDataFiller: function (element, key, rekey) {
			// element 当前操作对象
			// key 当前序列key
			// rekey 上一次的序列key

			// 操作完在此之行element对象上的事件
		},


		// 获取模版视图cache方法，每次翻页会执行

		getInfiniteCacheBuffer: function (data, key) {
			// 当前操作序列的 scope data
			// 如果当前cache不存在则 创建 序列模版视图，如果存在吐出cache

			return element
		}

	})
```

// 滚动上常用的必要方法

```js
scroll.on(event, fn)
scroll.off(event, fn)
scroll.one(event, fn)    // event [ scroll, scrollstart, scrollend, beforescrollstart, scrollcancel, modify]

scroll.disable()
scroll.enable()
scroll.revert()
scroll.destroy()

scroll.refresh()

scroll.scrollTo(x, y, time, easing)
scroll.scrollToElement(el, time, offsetX, offsetY, easing)
scroll.next()
scroll.prev()

scroll.getComputedPosition()

scroll.refreshInfiniteAll()


// 常用的一些基础变量

this.x
this.y
this.maxScrollX
this.maxScrollY
```