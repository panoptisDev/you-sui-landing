import Page from '../components/common/Page';
import { CompletePools, Intro, Launchpad, Overview, Questions, UpcomingPools } from '../components/home-v2';

export default function Homepage_v2() {
    return (
        <Page title="Home">
            <Intro />
            <Overview />
            <Launchpad />
            <UpcomingPools />
            {/* <CompletePools /> */}
            <Questions />
        </Page>
    );
}
