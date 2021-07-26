import VSignature from '../VSignature'
import { shallowMount } from '@vue/test-utils'

import { signatureMockData } from './mock'

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
        const wrapper = shallowMount(VSignature);

        await expect(wrapper.vm.toDataURL('text/html')).rejects.toThrow('Incorrect image type!')
    });

    it('should return undefined', async () => {
        const wrapper = shallowMount(VSignature)

        await expect(wrapper.vm.toDataURL()).resolves.toBe(undefined)
    });

    it('should clear signature', () => {
        const initialPointsData = {
            allPoints: [],
            currentPoints: null
        }

        const wrapper = shallowMount(VSignature)

        wrapper.setData({
            history: [signatureMockData],
            historyStep: 1,
            points: initialPointsData
        })
        wrapper.vm.clear()

        expect(wrapper.vm.history).toEqual([initialPointsData])
        expect(wrapper.vm.historyStep).toBe(0)
        expect(wrapper.vm.points).toEqual(wrapper.vm.history[0])
    });

    it('should undo signature', () => {
        const initialPointsData = {
            allPoints: [],
            currentPoints: null
        }

        const wrapper = shallowMount(VSignature)

        wrapper.setData({
            history: [signatureMockData],
            historyStep: 1,
            points: initialPointsData
        })

        wrapper.vm.undo()

        expect(wrapper.vm.points).toEqual(initialPointsData)
        expect(wrapper.vm.history).toEqual([initialPointsData, signatureMockData])
        expect(wrapper.vm.historyStep).toBe(0)
    });

    it('should redo signature', () => {
        const initialPointsData = {
            allPoints: [],
            currentPoints: null
        }

        const wrapper = shallowMount(VSignature)

        wrapper.setData({
            history: [signatureMockData],
            historyStep: 0,
            points: initialPointsData
        })

        wrapper.vm.redo()

        expect(wrapper.vm.points).toEqual(signatureMockData)
        expect(wrapper.vm.history).toEqual([initialPointsData, signatureMockData])
        expect(wrapper.vm.historyStep).toBe(1)
    })

    it('should return empty status', () => {
        const wrapper = shallowMount(VSignature)
        
        expect(wrapper.vm.isEmpty()).toBe(true)
    })
})