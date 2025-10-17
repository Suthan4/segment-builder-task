import { useState } from "react";
import { X, Plus } from "lucide-react";

interface SchemaOption {
  label: string;
  value: string;
}

interface SelectedSchema {
  id: string;
  value: string;
}

interface SegmentData {
  segment_name: string;
  schema: Array<{ [key: string]: string }>;
}

const schemaOptions: SchemaOption[] = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

export default function SegmentBuilder() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState<SelectedSchema[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getAvailableOptions = (): SchemaOption[] => {
    const selectedValues = selectedSchemas.map((s) => s.value);
    return schemaOptions.filter((opt) => !selectedValues.includes(opt.value));
  };

  const handleAddSchema = () => {
    if (dropdownValue) {
      const newId = Date.now().toString();
      setSelectedSchemas([
        ...selectedSchemas,
        { id: newId, value: dropdownValue },
      ]);
      setDropdownValue("");
    }
  };

  const handleRemoveSchema = (id: string) => {
    setSelectedSchemas(selectedSchemas.filter((s) => s.id !== id));
  };

  const handleSchemaChange = (id: string, newValue: string) => {
    setSelectedSchemas(
      selectedSchemas.map((s) => (s.id === id ? { ...s, value: newValue } : s))
    );
  };

  const handleSaveSegment = async () => {
    if (!segmentName.trim()) {
      setMessage("Please enter a segment name");
      return;
    }

    if (selectedSchemas.length === 0) {
      setMessage("Please add at least one schema");
      return;
    }

    const schemaArray = selectedSchemas.map((schema) => {
      const option = schemaOptions.find((opt) => opt.value === schema.value);
      return { [schema.value]: option?.label || "" };
    });

    const payload: SegmentData = {
      segment_name: segmentName,
      schema: schemaArray,
    };

    setIsLoading(true);
    try {
      const webhookUrl =
        "https://webhook.site/92384eff-b9a0-431f-b09f-223e5b403885";
      const response = await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      setMessage("Segment saved successfully!");
      // Reset form
      setSegmentName("");
      setSelectedSchemas([]);
      setDropdownValue("");
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage("Error sending data to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSegmentName("");
    setSelectedSchemas([]);
    setDropdownValue("");
    setMessage("");
  };

  return (
    <>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Segment Builder
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Save segment
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Create Segment
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Segment Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Segment Name
                </label>
                <input
                  type="text"
                  value={segmentName}
                  onChange={(e) => setSegmentName(e.target.value)}
                  placeholder="Enter segment name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Schema Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add schema to segment
                </label>
                <div className="flex gap-2">
                  <select
                    value={dropdownValue}
                    onChange={(e) => setDropdownValue(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a schema</option>
                    {getAvailableOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddSchema}
                    disabled={!dropdownValue}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition flex items-center gap-1 font-semibold"
                  >
                    <Plus size={18} />
                    Add new schema
                  </button>
                </div>
              </div>

              {/* Selected Schemas Blue Box */}
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Selected Schemas:
                </p>
                {selectedSchemas.length === 0 ? (
                  <p className="text-gray-400 text-sm">No schemas added yet</p>
                ) : (
                  <div className="space-y-2">
                    {selectedSchemas.map((schema) => (
                      <div
                        key={schema.id}
                        className="flex items-center gap-2 bg-white p-2 rounded border border-blue-200"
                      >
                        <select
                          value={schema.value}
                          onChange={(e) =>
                            handleSchemaChange(schema.id, e.target.value)
                          }
                          className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value={schema.value}>
                            {
                              schemaOptions.find(
                                (opt) => opt.value === schema.value
                              )?.label
                            }
                          </option>
                          {getAvailableOptions().map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRemoveSchema(schema.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`p-3 rounded-lg text-sm font-medium ${
                    message.includes("success")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSegment}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {isLoading ? "Saving..." : "Save Segment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
