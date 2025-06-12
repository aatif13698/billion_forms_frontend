import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import ResponsiveMenu from '../../components/Navbar/ResponsiveMenu';
import Hero from '../../components/Hero/Hero';
import OurVison from '../../components/OurVission/OurVission';
import Img1 from "../../assets/images/ourmission.png"
import Img2 from "../../assets/images/notFound.png"



const ourVison = {
    image: Img1,
    tag: "Take a Stand for Sustainability",
    title: "Our Mission",
    subtitle:
        "At Mint District, our mission is to revolutionize car care by offering convenient, eco friendly solutions that prioritize water conservation and sustainability. We aim to reduce the environmental footprint of traditional car washing methods by delivering high-quality, dry wash services tailored to the needs of urban car owners. Our goal is to make daily car cleaning accessible, sustainable, and efficient for all.",
    link: "#",
};

const aboutUs = {
    image: Img2,
    tag: "Driven to care for your car",
    title: "About us",
    subtitle:
        "We are Mint District embodies freshness, modernity, and a strong commitment to sustainability. As pioneers in eco friendly car care, we are dedicated to minimizing water waste by utilizing innovative dry wash methods that not only keep your vehicle spotless but also contribute to a cleaner, greener future. At Mint District, we believe that car cleaning should be efficient environmentally responsible, and hassle free for urban dwellers especially those in apartment communities. Join us in our mission to reduce environmental impact while keeping your car in mint condition..",
    link: "#",
};

function LandingPage({ companyIdentifier }) {

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const openModal = (data) => {
        setIsModalOpen(true);
        setName(data)
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (import.meta.env.VITE_NODE_ENV == "development") {
            if (companyIdentifier && companyIdentifier !== "8081") {
                navigate("/login")
            }
        } else {

            if (companyIdentifier && companyIdentifier !== "aestree") {
                navigate("/login")
            }
        }
    }, [companyIdentifier])

    return (
        <main className="overflow-x-hidden h-screen" style={{ position: "relative" }}>
            <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
            <ResponsiveMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            <section id="home" >
                <Hero />
            </section>
            <section id="ourMission">
                <OurVison {...ourVison} />
            </section>

            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>
            <div>adsfdsf</div>

        </main>
    )
}

export default LandingPage
