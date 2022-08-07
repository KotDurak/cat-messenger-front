import ModalDialog from "@/components/UI/ModalDialog";
import LoginForm from "@/components/LoginForm";
import {render, screen} from '@testing-library/vue'

test('test modal dialog', () => {
    const options = {
        slots: {
            default: '<div>Tigr</div>'
        },
        propsData: {
            show: true
        }
    }

    render(ModalDialog, options)
    screen.debug()

    screen.getByText('Tigr')
})