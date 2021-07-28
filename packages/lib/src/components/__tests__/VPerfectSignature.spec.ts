import { shallowMount } from '@vue/test-utils'

import { mockDataURL, inputPointsMockData } from './mock'
import VPerfectSignature from '../VPerfectSignature'

describe('#props', () => {
    it('should receive default props', () => {
        const wrapper = shallowMount(VPerfectSignature)

        const expectedWidth = '100%'
        const expectedHeight = '100%'
        const expectedPenColor = '#000'
        const expectedBackgroundColor = 'rgba(0,0,0,0)'
        const expectedStrokeOptions = {}

        expect(wrapper.props().width).toBe(expectedWidth)
        expect(wrapper.props().height).toBe(expectedHeight)
        expect(wrapper.props().penColor).toBe(expectedPenColor)
        expect(wrapper.props().backgroundColor).toBe(expectedBackgroundColor)
        expect(wrapper.props().strokeOptions).toEqual(expectedStrokeOptions)
    })   
})

describe('#toDataURL', () => {
    it('throws error if invalid type', () => {
        const wrapper = shallowMount(VPerfectSignature)

        expect(() => wrapper.vm.toDataURL('text/html')).toThrow()
    })

    it('returns undefined if pad is empty', () => {
        const wrapper = shallowMount(VPerfectSignature)

        expect(wrapper.vm.toDataURL()).toBeUndefined()
    })

    // TODO: Returns incorrect data url. Bug?
    // it('should return data uri', () => {
    //     const wrapper = shallowMount(VPerfectSignature)

    //     wrapper.setData({
    //         allInputPoints: inputPointsMockData
    //     })

        
    //     expect(wrapper.vm.toDataURL()).toBe(mockDataURL)
    // })
})

describe('#fromDataURL', () => {
    it('should set signature from data uri', async () => {
        const wrapper = shallowMount(VPerfectSignature)

        await expect(wrapper.vm.fromDataURL(mockDataURL)).resolves.toBe(true)
    })

    jest.spyOn(console, 'error').mockImplementation(() => {})

    it('fails if data uri is incorrect', async () => {
        const wrapper = shallowMount(VPerfectSignature)

        await expect(wrapper.vm.fromDataURL('random string')).rejects.toBe('Incorrect data uri provided')
    })  
})

describe('#toData', () => {
    it('returns array of array input points', () => {
        const wrapper = shallowMount(VPerfectSignature)
        
        wrapper.setData({
            allInputPoints: inputPointsMockData
        })

        expect(wrapper.vm.toData()).toEqual(inputPointsMockData)
    })

    it('should set signature from array of array of input points', () => {
        const wrapper = shallowMount(VPerfectSignature)

        expect(wrapper.vm.fromData(inputPointsMockData)).toBeUndefined()
        expect(wrapper.vm.toData()).toEqual(inputPointsMockData)
    })
})

describe('#clear', () => {
    it('clears data structures and pad', () => {
        const wrapper = shallowMount(VPerfectSignature)

        wrapper.setData({
            allInputPoints: inputPointsMockData
        })
        wrapper.vm.clear()

        expect(wrapper.vm.toData()).toEqual([])
    })
})

describe('#isEmpty', () => {
    it('returns true if pad is empty', () => {
        const wrapper = shallowMount(VPerfectSignature)
        
        expect(wrapper.vm.isEmpty()).toBe(true)
    })

    it('returns false if pad is not empty', () => {
        const wrapper = shallowMount(VPerfectSignature)
        
        wrapper.setData({
            allInputPoints: inputPointsMockData
        })
        
        expect(wrapper.vm.isEmpty()).toBe(false)
    })
})