export default function About() {
  
  return (
    <div className=" min-h-screen text-black">
      <main className="container mx-auto p-8">
        <h1 className="mx-5 text-4xl font-bold mt-8 mb-6">About Us</h1>
        <section className="mx-5 mt-10">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-justify">
            Welcome to our blog! Our mission is to share valuable insights, tips, and stories to help you stay informed and inspired. We cover a wide range of topics to cater to various interests, and we are dedicated to providing high-quality content that adds value to your life.
          </p>
        </section>
        <section className="mx-5 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-lg text-justify">
            Our journey began with a simple idea: to create a space where readers can find useful and engaging content. As our blog grew, so did our passion for exploring new topics and sharing our knowledge. We strive to connect with our audience through authentic and meaningful content.
          </p>
        </section>
        <section className="mx-5 mt-8">
          <h2 className="text-2xl font-semibold mb-4">What to Expect</h2>
          <p className="text-lg text-justify">
            On our blog, you can expect a diverse range of articles, from in-depth analysis and how-to guides to personal stories and opinion pieces. We aim to engage with our readers and provide content that is not only informative but also enjoyable to read.
          </p>
        </section>
      </main>
    </div>
  );
}
