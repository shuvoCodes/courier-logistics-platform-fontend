import Hero from '../Components/Hero'
import Services from '../Components/Services'
import HowItWorks from '../Components/HowItWorks'
import Fees from '../Components/Fees'
import Capabilities from '../Components/Capabilities'
import CAT from '../Components/CAT'
const HomePage = () => {
    return (
        <div>
           <Hero/>
           <Services/>
           <HowItWorks/>
           <Fees/>
           <Capabilities/>
           <CAT/>
        </div>
    );
};

export default HomePage;