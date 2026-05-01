import React, { useState, useEffect } from 'react'
import { View, Text, Canvas, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

const data = [
  { name: '学习后', eb: 100, me: 100 },
  { name: '今天',   eb: 68,  me: 86  },
  { name: '明天',   eb: 50,  me: 76  },
  { name: '后天',   eb: 40,  me: 71  },
  { name: '4天',    eb: 33,  me: 68  },
  { name: '5天',    eb: 29,  me: 66  },
  { name: '6天',    eb: 27,  me: 64  },
  { name: '7天',    eb: 25,  me: 63  },
  { name: '8天',    eb: 23,  me: 62  },
  { name: '9天',    eb: 22,  me: 61  },
  { name: '10天',   eb: 21,  me: 60  },
  { name: '11天',   eb: 20,  me: 59  },
  { name: '12天',   eb: 19,  me: 58  },
  { name: '13天',   eb: 18,  me: 58  },
  { name: '14天',   eb: 18,  me: 57  },
  { name: '15天',   eb: 17,  me: 56  },
  { name: '20天',   eb: 14,  me: 53  },
  { name: '25天',   eb: 11,  me: 51  },
  { name: '30天',   eb: 9,   me: 49  },
  { name: '2个月',  eb: 6,   me: 45  },
  { name: '3个月',  eb: 4,   me: 42  },
  { name: '4个月',  eb: 3,   me: 39  },
  { name: '5个月',  eb: 2,   me: 37  },
  { name: '半年',   eb: 2,   me: 35  },
]

const COL_W = 42
const PAD   = { top: 10, right: 16, bottom: 28, left: 36 }
const CHART_W = data.length * COL_W + PAD.left + PAD.right  // 1056
const CHART_H = 180
const CHART_AREA_H = CHART_H - PAD.top - PAD.bottom         // 142

const px = (i) => PAD.left + i * COL_W + COL_W / 2
const py = (v) => PAD.top + (1 - v / 100) * CHART_AREA_H

const drawChart = (activeIdx = -1) => {
  const ctx = Taro.createCanvasContext('ebbinghaus')
  ctx.clearRect(0, 0, CHART_W, CHART_H)

  const right = CHART_W - PAD.right

  // 水平网格线
  ctx.setStrokeStyle('rgba(226,232,240,0.8)')
  ctx.setLineWidth(1)
  ctx.setLineDash([])
  ;[0, 25, 50, 75, 100].forEach(p => {
    const y = py(p)
    ctx.beginPath()
    ctx.moveTo(PAD.left, y)
    ctx.lineTo(right, y)
    ctx.stroke()
  })

  // Y 轴标签
  ctx.setFontSize(9)
  ctx.setFillStyle('rgb(148,163,184)')
  ctx.setTextAlign('left')
  ;[0, 50, 100].forEach(p => {
    ctx.fillText(`${p}%`, 10, py(p) + 3)
  })

  // X 轴标签
  ctx.setTextAlign('center')
  data.forEach((d, i) => {
    ctx.fillText(d.name, px(i), CHART_H - 4)
  })

  // 活动列垂直指示线
  if (activeIdx >= 0) {
    ctx.setStrokeStyle('rgba(99,82,230,0.25)')
    ctx.setLineDash([4, 3])
    ctx.setLineWidth(1)
    ctx.beginPath()
    ctx.moveTo(px(activeIdx), PAD.top)
    ctx.lineTo(px(activeIdx), PAD.top + CHART_AREA_H)
    ctx.stroke()
  }

  // eb 线 — 灰色虚线
  ctx.setLineDash([5, 4])
  ctx.setStrokeStyle('rgb(148,163,184)')
  ctx.setLineWidth(1.8)
  ctx.beginPath()
  data.forEach((d, i) => {
    i === 0 ? ctx.moveTo(px(i), py(d.eb)) : ctx.lineTo(px(i), py(d.eb))
  })
  ctx.stroke()

  // eb 数据点
  ctx.setLineDash([])
  data.forEach((d, i) => {
    ctx.beginPath()
    ctx.arc(px(i), py(d.eb), i === activeIdx ? 3.5 : 1.5, 0, Math.PI * 2)
    ctx.setFillStyle('rgb(148,163,184)')
    ctx.fill()
  })

  // me 线 — 紫色实线
  ctx.setStrokeStyle('rgb(99,82,230)')
  ctx.setLineWidth(2.2)
  ctx.beginPath()
  data.forEach((d, i) => {
    i === 0 ? ctx.moveTo(px(i), py(d.me)) : ctx.lineTo(px(i), py(d.me))
  })
  ctx.stroke()

  // me 数据点
  data.forEach((d, i) => {
    ctx.beginPath()
    ctx.arc(px(i), py(d.me), i === activeIdx ? 4 : 2, 0, Math.PI * 2)
    ctx.setFillStyle('rgb(99,82,230)')
    ctx.fill()
  })

  ctx.draw()
}

const MemorySection = () => {
  const [showHint, setShowHint]   = useState(true)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    setTimeout(() => drawChart(-1), 300)
  }, [])

  const handleScroll = (e) => {
    const sl = e.detail.scrollLeft
    setScrollLeft(sl)
    if (sl > 4) setShowHint(false)
  }

  // 触摸 canvas → 高亮最近的数据列
  const handleCanvasTouch = (e) => {
    // e.touches[0].x 是相对 canvas 元素的坐标（WeChat 2.15.0+）
    // 若拿不到则用 clientX + scrollLeft 估算
    const rawX = e.touches[0].x != null
      ? e.touches[0].x
      : e.touches[0].clientX + scrollLeft
    const col = Math.round((rawX - PAD.left - COL_W / 2) / COL_W)
    const idx = Math.max(0, Math.min(data.length - 1, col))
    setActiveIdx(idx)
    drawChart(idx)
  }

  const active = activeIdx >= 0 ? data[activeIdx] : null

  return (
    <View className={styles.memorySection}>
      <View className={styles.sectionTitleRow}>
        <Text style={{ color: 'rgb(99,82,230)', fontSize: '16px' }}>🧠</Text>
        <Text className={styles.sectionTitle}>遗忘曲线</Text>
        <Text className={styles.aiTag}>AI 估算至半年</Text>
      </View>

      <View className={styles.chartWrapper}>
        {/* 图例 */}
        <View className={styles.legend}>
          <View className={styles.legendItem}>
            <View className={`${styles.legendLine} ${styles.legendDash}`} />
            <Text className={styles.legendText}>艾宾浩斯</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={`${styles.legendLine} ${styles.legendSolid}`} />
            <Text className={styles.legendText}>我的曲线</Text>
          </View>
        </View>

        {/* 可横向滚动的图表区 */}
        <View className={styles.scrollWrap}>
          <ScrollView
            scrollX
            className={styles.scrollArea}
            onScroll={handleScroll}
          >
            <Canvas
              canvasId="ebbinghaus"
              style={{ width: `${CHART_W}px`, height: `${CHART_H}px`, display: 'block' }}
              onTouchStart={handleCanvasTouch}
            />
          </ScrollView>

          {/* 右侧渐变 + 右滑提示 */}
          {showHint && (
            <View className={styles.fadeHint}>
              <Text className={styles.hintText}>右滑</Text>
              <Text className={styles.hintArrow}>›</Text>
            </View>
          )}
        </View>


      </View>
    </View>
  )
}

export default MemorySection
