import React, { useState, useEffect } from "react";
import axios from "axios";

const TagManagementPage = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/tags", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTags(response.data);
    } catch (err) {
      console.error("Fehler beim Abrufen der Tags:", err.response?.data || err.message);
    }
  };

  const createTag = async () => {
    if (!newTag) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/tags",
        { name: newTag },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTags([...tags, response.data]);
      setNewTag("");
    } catch (err) {
      console.error("Fehler beim Erstellen des Tags:", err.response?.data || err.message);
    }
  };

  const deleteTag = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tags/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTags(tags.filter((tag) => tag._id !== id));
    } catch (err) {
      console.error("Fehler beim Löschen des Tags:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h1>Tag-Management</h1>
      <div>
        <input
          type="text"
          placeholder="Neuen Tag eingeben"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <button onClick={createTag}>Tag erstellen</button>
      </div>
      <ul>
        {tags.map((tag) => (
          <li key={tag._id}>
            {tag.name}
            <button onClick={() => deleteTag(tag._id)}>Löschen</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagManagementPage;
