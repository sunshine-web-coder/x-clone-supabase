export default function ComposePage() {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create Posts</h1>
        <textarea 
          className="w-full border rounded-lg p-2 mb-4"
          placeholder="What's happening?"
          rows={4}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
          Post
        </button>
      </div>
    );
  }