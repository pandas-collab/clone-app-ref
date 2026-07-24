export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          We are a leading company dedicated to providing exceptional services
          and solutions to our clients worldwide.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To deliver innovative solutions that drive business growth and
              create lasting value for our clients and partners.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be the trusted partner of choice for businesses seeking
              digital transformation and growth opportunities.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Excellence in everything we do</li>
            <li>Innovation and continuous improvement</li>
            <li>Integrity and transparency</li>
            <li>Client-focused solutions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
