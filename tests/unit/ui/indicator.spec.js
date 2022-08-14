import {render, screen} from '@testing-library/vue'
import IndicatorCheck from "@/components/UI/IndicatorCheck";

function getElem() {
    return screen.getByTestId('indicator')
}

test('test check indicator', () => {
    render(IndicatorCheck, {
        props: {
            checked: true
        },
        global: {
            stubs: ['BootstrapIcon']
        }
    })

    const elem = getElem()
    const elemClass = elem.getAttribute('class')
    expect(elemClass).toContain('text-success')
})

test('test unchecked indicator', () => {
    render(IndicatorCheck, {
        global: {
            stubs: ['BootstrapIcon']
        }
    })

    const elem = getElem()
    const elemClass = elem.getAttribute('class')
    expect(elemClass).not.toContain('text-success')
})