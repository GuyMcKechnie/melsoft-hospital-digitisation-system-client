import React, { useState } from 'react'
import { Trash2, Plus } from 'lucide-react';

function Admin()  {

  // Logic to be able to add new patients and delete them manually
  const [patients, setPatients] = useState([
    {
      name: "Janet Abigail",
      id: "12345678",
      lastVisit: "March 7th 2025",
      diagnosis: "Flu",
      doctor: "Blok",
      age: 21
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    id: "",
    lastVisit: "",
    diagnosis: "",
    doctor: "",
    age: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (newPatient.name && newPatient.id) {
      setPatients(prev => [...prev, { ...newPatient, age: parseInt(newPatient.age) || 0 }]);
      setNewPatient({
        name: "",
        id: "",
        lastVisit: "",
        diagnosis: "",
        doctor: "",
        age: ""
      });
      setShowForm(false);
    }
  };

  const handleDeletePatient = (index) => {
    setPatients(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-3xl font-bold text-black text-center mb-6">
        Admin Panel
      </h2>

      <div className="mb-4 flex justify-end">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add New Patient'}
        </button>
      </div>

{/* adding the new patient form */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-xl shadow-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Patient</h3>
          <form onSubmit={handleAddPatient} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Patient Name"
              value={newPatient.name}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="id"
              placeholder="ID Number"
              value={newPatient.id}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="lastVisit"
              placeholder="Last Visit (e.g., March 7th 2025)"
              value={newPatient.lastVisit}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="diagnosis"
              placeholder="Diagnosis"
              value={newPatient.diagnosis}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="doctor"
              placeholder="Doctor Name"
              value={newPatient.doctor}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={newPatient.age}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="md:col-span-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              Add Patient
            </button>
          </form>
        </div>
      )}

{/* creating new patient form */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-xl">
          <thead>
            <tr className="bg-blue-400 text-white text-left">
              <th className="p-3">Patient Name</th>
              <th className="p-3">ID No</th>
              <th className="p-3">Last Visit</th>
              <th className="p-3">Diagnosis</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Age</th>
              <th className="p-3">Delete</th>
            </tr>
          </thead>

          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No accounts found
                </td>
              </tr>
            ) : (
              patients.map((patient, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{patient.name}</td>
                  <td className="p-3">{patient.id}</td>
                  <td className="p-3">{patient.lastVisit}</td>
                  <td className="p-3">{patient.diagnosis}</td>
                  <td className="p-3">{patient.doctor}</td>
                  <td className="p-3">{patient.age}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => handleDeletePatient(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default Admin