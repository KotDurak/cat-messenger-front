import {render, screen, fireEvent, waitFor} from '@testing-library/vue'
import ModalDialog from "@/components/UI/ModalDialog";


test('renders modal dialog', () => {
    const body = 'This is modal body'

    const options = {
        slots: {
            default: body
        },
        props: {
            show: true
        }
    }

    render(ModalDialog, options)
    screen.getByText(body)
})

test('close modal', async () => {
    const body = 'This is modal body'

    const options = {
        slots: {
            default: body
        },
        props: {
            show: true
        }
    }

    render(ModalDialog, options)
    screen.getByText(body)

    await fireEvent.click(screen.getByTestId('modal'))
 //   expect(screen.queryByText(body)).toBeNull()

})