import VSignature from '../VSignature'
import { shallowMount } from '@vue/test-utils'

import { pointsMockData, emptyPointsMockData, mockDataURL } from './mock'

describe('VSignature', () => {
    it('should receive default props', () => {
        const wrapper = shallowMount(VSignature)

        const expectedWidth = '100%'
        const expectedHeight = '100%'
        const expectedPenColor = '#000'
        const expectedBackgroundColor = 'rgba(0,0,0,0)'
        const expectedStrokeOptions = {}
        const expectedCustomStyle = {}

        expect(wrapper.props().width).toBe(expectedWidth)
        expect(wrapper.props().height).toBe(expectedHeight)
        expect(wrapper.props().penColor).toBe(expectedPenColor)
        expect(wrapper.props().backgroundColor).toBe(expectedBackgroundColor)
        expect(wrapper.props().strokeOptions).toEqual(expectedStrokeOptions)
        expect(wrapper.props().customStyle).toEqual(expectedCustomStyle)
    })

    it('should throw incorrect image error message', async () => {
        const wrapper = shallowMount(VSignature)

        await expect(wrapper.vm.toDataURL('text/html')).rejects.toThrow('Incorrect image type!')
    })

    it('should return undefined', async () => {
        const wrapper = shallowMount(VSignature)

        await expect(wrapper.vm.toDataURL()).resolves.toBe(undefined)
    })

    it('should return signature pad data', async () => {
        const wrapper = shallowMount(VSignature)

        // TODO: Test createObjectURL and Blob
        // global.URL.createObjectURL = jest.fn()
        // global.URL.revokeObjectURL = jest.fn()
        // @ts-ignore
        // global.Blob = function (content, options){return  ({content, options})}

        // wrapper.setData({
        //     history: [pointsMockData],
        //     historyStep: 1,
        //     points: emptyPointsMockData
        // })

        // await expect(wrapper.vm.toDataURL()).resolves.toBe(mockDataURL)
    })

    it('should clear signature', () => {
        const wrapper = shallowMount(VSignature)

        wrapper.setData({
            history: [pointsMockData],
            historyStep: 1,
            points: emptyPointsMockData
        })
        wrapper.vm.clear()

        expect(wrapper.vm.history).toEqual([emptyPointsMockData])
        expect(wrapper.vm.historyStep).toBe(0)
        expect(wrapper.vm.points).toEqual(emptyPointsMockData)
    })

    it('should undo signature', () => {
        const wrapper = shallowMount(VSignature)

        wrapper.setData({
            history: [pointsMockData],
            historyStep: 1,
            points: emptyPointsMockData
        })

        wrapper.vm.undo()

        expect(wrapper.vm.points).toEqual(emptyPointsMockData)
        expect(wrapper.vm.history).toEqual([emptyPointsMockData, pointsMockData])
        expect(wrapper.vm.historyStep).toBe(0)
    })

    it('should redo signature', () => {
        const wrapper = shallowMount(VSignature)

        wrapper.setData({
            history: [pointsMockData],
            historyStep: 0,
            points: emptyPointsMockData
        })

        wrapper.vm.redo()

        expect(wrapper.vm.points).toEqual(pointsMockData)
        expect(wrapper.vm.history).toEqual([emptyPointsMockData, pointsMockData])
        expect(wrapper.vm.historyStep).toBe(1)
    })

    it('should return signature pad empty status', () => {
        const wrapper = shallowMount(VSignature)
        
        expect(wrapper.vm.isEmpty()).toBe(true)
    })
})