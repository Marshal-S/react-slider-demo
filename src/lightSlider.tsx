import {useEffect, useRef, useState } from "react"

export const LightSlider = (props: {
    defaultValue?: number
    value?: number
    min?: number
    max?: number
    style?: React.CSSProperties
    changed?: (value?: number) => void
    completed?: (value?: number) => void
    width?: number
}) => {
    const value = useRef<number | undefined>(0)
    const [valueS, setValueS] = useState<number | undefined>() //用于内部显示使用
    const [sliderHeight, setSliderHeight] = useState<string>('0px')

    const min = useRef(props.min !== undefined ? props.min : 0)
    const max = useRef(props.max !== undefined ? props.max : 100)

    const y = useRef<number>(0)
    const h = useRef<number>(0)

    useEffect(() => {
        //保存基本高度，毕竟是纵向滚动条
        let element = document.getElementById('my-slider')
        if (element) {
            let rect = element.getBoundingClientRect()
            y.current = rect.y
            h.current = rect.height
        }
    }, [])

    useEffect(() => {
        setValueS(value.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value.current])
    

    //处理默认亮度，可能不为10的整数倍
    useEffect(() => {
        value.current = props.value
    }, [props.value])

    const addListener = () => {
        document.addEventListener('touchmove', onMove)
        document.addEventListener('touchend', onEnd)
        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onEnd)
    }

    const removeListener = () => {
        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onEnd)
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)
    }

    const onUpdateLum = (e: any) => {
        //获取内组件偏移量
        let clientY = e.clientY !== undefined ? e.clientY : e.touches[0].screenY
        //我们要控制好边界，保证进度在 0 ~ 1 之间
        let offsetY = clientY - y.current
        const height = h.current
        //控制边界，保证进度在 0 ~ 1 之间
        if (offsetY < 0) offsetY = 0
        if (offsetY > height) offsetY = height
        let radio = offsetY / height
        
        //获取进度条值间隔
        let interval = max.current - min.current
        //实际进度值
        let num = radio * interval
        
        //通过四射五入纠正到整数
        let q = Math.floor(num)
        let r = num - q
        if (r >= 0.5 || r <= -0.5) {
            q++
        }

        //为了渲染过渡，值变化才进行渲染
        if (value.current !== q) {
            //结果需要加上最小值，才是实际进度
            value.current = q + min.current
            //设置进度百分比
            setSliderHeight(`${q / interval * 100}%`)
            //对外反馈进度
            props.changed && props.changed(q)
        }
    }

    const onStart = (e: any) => {
        addListener()
        onUpdateLum(e)
    }

    const onMove = (e: any) => {
        onUpdateLum(e)
    }

    const onEnd = async (e: any) => {
        removeListener()
        props.completed && props.completed(value.current)
    }

    const styles = props.style ?? {}
    const width = props.width !== undefined ? props.width : 10

    return (
        <div
            id="my-slider"
            onMouseDown={onStart}
            onTouchStart={onStart}
            style={{width: width, height: 100, display: 'flex', flexDirection: 'column', 
                backgroundColor: '#fff', pointerEvents: 'auto', border: '2px #333333 solid', ...styles}}>
            <div style={{width: width, height: sliderHeight, backgroundColor: '#1e2129'}} />
        </div>
    )
}