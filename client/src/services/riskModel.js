import axios from "axios";

export const callFlaskApi = async (inputData) => {
  try {
    //const inputData = [1.0, 12.0, 4.0, 2.0, 5.0, 2.0];

    const response = await axios.post("http://127.0.0.1:5000/predict", {
      inputs: [inputData], 
    });

    console.log("Response from Flask API:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error calling Flask API:", err.message);
    throw err;
  }
};


//console.log(callFlaskApi())