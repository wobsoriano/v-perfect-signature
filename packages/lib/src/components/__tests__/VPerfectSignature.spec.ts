import { shallowMount } from '@vue/test-utils'

import { mockDataURL, inputPointsMockData } from './mock'
import VPerfectSignature from '../VPerfectSignature'

describe('VPerfectSignature', () => {
    it('should receive default props', () => {
        const wrapper = shallowMount(VPerfectSignature)

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

    it('should throw incorrect image error message', () => {
        const wrapper = shallowMount(VPerfectSignature)

        expect(() => wrapper.vm.toDataURL('text/html')).toThrow()
    })

    it('should return undefined', () => {
        const wrapper = shallowMount(VPerfectSignature)

        expect(wrapper.vm.toDataURL()).toBeUndefined()
    })

    it('should return data uri', () => {
        const wrapper = shallowMount(VPerfectSignature)

        wrapper.setData({
            allInputPoints: inputPointsMockData
        })

        expect(mockDataURL).toBe(mockDataURL)
    })

    it('should return array of input points', () => {
        const wrapper = shallowMount(VPerfectSignature)
        
        wrapper.setData({
            allInputPoints: inputPointsMockData
        })

        expect(wrapper.vm.toData()).toEqual(inputPointsMockData)
    })

    it('should set signature from array of input points', () => {
        const wrapper = shallowMount(VPerfectSignature)

        expect(wrapper.vm.fromData(inputPointsMockData)).toBeUndefined()
        expect(wrapper.vm.toData()).toEqual(inputPointsMockData)
    })

    it('should clear signature pad', () => {
        const wrapper = shallowMount(VPerfectSignature)

        wrapper.setData({
            allInputPoints: inputPointsMockData
        })
        wrapper.vm.clear()

        expect(wrapper.vm.toData()).toEqual([])
    })

    it('should return signature pad empty status', () => {
        const wrapper = shallowMount(VPerfectSignature)
        
        expect(wrapper.vm.isEmpty()).toBeTruthy()
    })
})