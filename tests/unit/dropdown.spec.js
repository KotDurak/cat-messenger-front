import {render, screen} from '@testing-library/vue'
import DropDownMenu from "@/components/UI/DropDownMenu";

test('dropdown', () => {
    render(DropDownMenu, {
        slots: {
            default: 'Menu'
        },
        props: {
            items: [
                {
                    title: 'About',
                    callback: () => {
                        console.log('about')
                    }
                },
                {
                    title: 'menu2'
                }
            ]
        }
    })

    const ul = screen.getByText('About')
    console.log(ul)

    screen.debug()
})