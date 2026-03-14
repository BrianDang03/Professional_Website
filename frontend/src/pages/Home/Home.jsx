import SEO from "../../components/SEO";
import PageTransition from "../../components/PageTransition";
import HeroBlock from "../../components/HeroBlock/HeroBlock";
import HomeCards from "../../components/HomeCards/HomeCards";
import "./Home.css";

export default function Home({ name, job }) {
  return (
    <PageTransition>
      <SEO />
      <section className="home-shell">
        <div className="home-hero">
          <HeroBlock
            name={name}
            job={job}
            intro="Software engineer with a gameplay focus. I design and ship systems end-to-end — from player mechanics to production web interfaces — with an emphasis on feel, performance, and maintainability."
          />
          <HomeCards />
        </div>
        <div className="home-bottom-line" aria-hidden="true" />
      </section>
    </PageTransition>
  );
}