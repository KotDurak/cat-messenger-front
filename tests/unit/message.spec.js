import {render, screen} from '@testing-library/vue'
import UserMessage from "@/components/UserMessage";

test('test user message', () => {
    const datetime =  new Date()

    render(UserMessage, {
        props: {
            message: {
                message: 'Hello world',
                time:datetime
            },
            user: {
                user_data: {
                    name: 'Tigr'
                }
            }
        },
    })

    const text =  screen.getByTestId('base-message').textContent
    expect(text).toBeTruthy()
})

test('renders with class', () => {
    const datetime = new Date()
    const myclass = 'pb-4 chat-message-right';

    render(UserMessage, {
        props: {
            message: {
                message: 'Hello world',
                time: datetime
            },
            user: {
                user_data: {
                    name: 'Tigr'
                }
            },
            isMy: true
        }
    })

    const elem = screen.getByTestId('message-wrapper')
    expect(elem.getAttribute('class')).toBe(myclass)
})