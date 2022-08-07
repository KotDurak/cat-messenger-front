import {render, prettyDOM, screen} from '@testing-library/vue'
import UserNotice from "@/components/UserNotice";

test('renders base', () => {
    render(UserNotice)
    screen.debug()
})