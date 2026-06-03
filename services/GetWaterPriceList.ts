import authServices from "./auth";

export async function GetWaterPriceList(workKind: any) {
    const API_URL = `http://ardabfa.ir/sanjabservice/api/GetWaterPriceWorkList`;
    // const API_URL = `http://emeter.abfasb.ir/sanjabServicesTest/api/GetWaterPriceWorkList`;
    // const API_URL = `https://moshtarakin.abfaazarbaijan.ir/SanjabServices/api/GetWaterPriceWorkList`;
    try {
        const token = await authServices.getAccessToken();
        
        const formData = new URLSearchParams();
        formData.append('workKind', workKind.toString());
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            },
            body: formData.toString()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in GetWaterPriceList:", error);
        throw error;
    }
}