import { createContext, ReactNode, useEffect, useState } from "react";

interface CupomContextProps {
    setCupom: () => void;
    cupomInput: boolean;
}

interface CupomContextData {
    children: ReactNode
}

export const CupomContext = createContext({} as CupomContextProps);

function CupomProvider({children}: CupomContextData) {

    const [cupomInput, setCupomInput] = useState<boolean>(false);

    function setCupom() {
        setCupomInput(true);
        console.log(true);
    }

    return (
        <CupomContext.Provider value={{setCupom, cupomInput}}>
            {children}
        </CupomContext.Provider>
    )
}

export default CupomProvider;