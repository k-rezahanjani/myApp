import authServices from "./authService";

export async function SaveWaterPriceList(payload: any) {
    const API_URL =
        // "http://emeter.abfasb.ir/SanjabServicesTest/api/SaveWaterPriceWork";
        // "https://moshtarakin.abfaazarbaijan.ir/SanjabServices/api/SaveWaterPriceWork";
        "http://ardabfa.ir/sanjabservice/api/GetWaterPriceWorkList";

    const token = await authServices.getAccessToken();

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("Response:", result);

    if (!response.ok) {
        throw new Error(
            result?.exception?.message ||
            result?.message ||
            "خطای ناشناخته از سرور"
        );
    }

    return result;
}