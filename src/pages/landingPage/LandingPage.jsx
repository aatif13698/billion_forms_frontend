import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function LandingPage({ companyIdentifier }) {

    const navigate = useNavigate()
    console.log("companyIdentifier landing", companyIdentifier);
    useEffect(() => {
        if (import.meta.env.VITE_NODE_ENV == "development") {
            if (companyIdentifier && !companyIdentifier == "aestree") {
                navigate("/login")
            }
        } else {
            if (companyIdentifier && !companyIdentifier == "8081") {
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
