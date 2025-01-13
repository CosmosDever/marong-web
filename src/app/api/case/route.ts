import axios from "axios";

// const allUrl = "https://jsonplaceholder.typicode.com/todos";

// export const fetchData = async () => {
//     try {
//       const response = await axios.get(allUrl); 
//       const data = response.data;

//       return data;
//     } catch (error) {
//     //   console.error("Error fetching data:", error.message);
//     }
//   };

  export const caseAll = async()=>{
    const data = [
        {
            "status": "success",
            "data": [
              {
                "case_id": "101",
                "category": "Road Damage",
                "picture": "https://example.com/images/road-damage-101.jpg",
                "date_opened": "2024-12-20T08:00:00Z",
                "damage_value": 2500.75,
                "status": "Waiting",
                "detail": "Potholes on main road causing traffic issues."
              },
              {
                "case_id": "102",
                "category": "Light Issues",
                "picture": "https://example.com/images/light-issues-102.jpg",
                "date_opened": "2024-12-18T10:30:00Z",
                "damage_value": 2500.75,
                "status": "In Progress",
                "detail": "Streetlight not working near intersection."
              },
              {
                "case_id": "103",
                "category": "Pavement Issues",
                "picture": "https://example.com/images/pavement-issues-103.jpg",
                "date_opened": "2024-11-30T12:00:00Z",
                "damage_value": 2500.75,
                "status": "Done",
                "detail": "Cracked sidewalk causing safety concerns."
              },
              {
                "case_id": "104",
                "category": "Overpass Issues",
                "picture": "https://example.com/images/overpass-issues-104.jpg",
                "damage_value": 2500.75,
                "date_opened": "2024-12-22T09:45:00Z",
                "status": "Waiting",
                "detail": "Damaged railing on pedestrian overpass."
              }
            ]
          }
    ]
    return data
}