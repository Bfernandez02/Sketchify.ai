import axios from "axios";
const  BASE_URL = "http://localhost:5000"

export const CallApi = async(ImageData)=>{

    try {
        const response = axios.post(`${BASE_URL}/generate-prompt`,{
            image: ImageData,
        });
        console.log('API Call successfull');

        return response.data;

    } catch (error) {
        console.error("Error:", error);
        return { error: "Something went wrong while calling the API" };
    }
}