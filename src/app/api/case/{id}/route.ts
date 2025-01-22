export const caseId = async () => {
    const data = [
      {
        status: "success",
        data: {
          case_id: "101",
          category: "Road Damage",
          detail: "Potholes on main road causing traffic issues.",
          location: {
            coordinates: [-122.414, 37.776],
            description: "Bangkok, Thailand",
          },
          damage_value: 2500.75,
          status: "Waiting",
          date_opened: "2024-12-20T08:00:00Z",
          date_closed: null, // Null if not yet closed
          picture: "https://example.com/images/road-damage-101.jpg",
          picture_done: "https://example.com/images/road-damage-101.jpg",
          user: {
            user_id: "5",
            full_name: "John Doe",
            gmail: "john.doe@example.com",
            picture: "https://example.com/images/user-5.jpg",
          },
        },
      },
    ];
    return data;
  };