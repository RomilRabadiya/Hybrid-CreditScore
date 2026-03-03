import axios from "axios";

const API_BASE_URL = "http://localhost:8080/explain";

export const getVisualization = async (type, analysis) => {
    const response = await axios.post(`${API_BASE_URL}/${type}`, analysis, {
        responseType: "blob"
    });
    return URL.createObjectURL(response.data);
};
