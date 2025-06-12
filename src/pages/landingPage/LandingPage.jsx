import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function LandingPage({ companyIdentifier }) {
    console.log("import.meta.env.VITE_NODE_ENV", import.meta.env.VITE_NODE_ENV);


    const navigate = useNavigate()
    console.log("companyIdentifier landing", companyIdentifier);
    useEffect(() => {
        if (import.meta.env.VITE_NODE_ENV == "development") {
            if (companyIdentifier && !companyIdentifier == "8081") {
                navigate("/login")
            }
        } else {

            if (companyIdentifier && !companyIdentifier == "aestree") {
                navigate("/login")
            }
        }
    }, [companyIdentifier])

    return (
        <div>
            This is landig page
        </div>
    )
}

export default LandingPage
