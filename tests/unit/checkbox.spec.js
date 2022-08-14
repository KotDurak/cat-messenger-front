import {render, screen} from '@testing-library/vue'
import CheckBox from "@/components/UI/CheckBox";

test.only('renders checked checkbox', () => {
    render(CheckBox, {
        props: {
          id: 'checkbox',
          modelValue:1,
        },
        slots: {
            default: 'Test label'
        }
    })

    const checkbox = screen.getByLabelText('Test label')
    expect(checkbox.checked).toBe(true)
})

test('renders checkbox without label', () => {
    render(CheckBox, {

    })

    expect(screen.getByRole('checkbox').checked).toBe(false)
})