import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import ResponsiveMenu from '../../components/Navbar/ResponsiveMenu';

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
