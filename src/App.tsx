import Hero from "./components/Hero";
import Nav from "./components/Nav";
import { useActiveSection } from "./hooks/useActiveSection";

function App() {
  const activeSection = useActiveSection();

  return (
    <div className="bg-navy text-slate">
      <div className="mx-auto min-h-screen max-w-screen-xl px-6 md:px-12 lg:flex lg:gap-4 lg:px-24 lg:py-0">
        {/* Left sidebar — sticky on large screens */}
        <header className="flex flex-col gap-6 py-12 lg:sticky lg:top-0 lg:h-screen lg:w-1/2 lg:justify-between lg:py-24">
          <div>
            <Hero />
            <div className="mt-12">
              <Nav activeSection={activeSection} />
            </div>
          </div>
          {/* TODO: Social links go here */}
        </header>

        {/* Right content — scrolls */}
        <main className="lg:w-1/2 lg:py-24">
          <section id="about" className="mb-24 scroll-mt-24">
            <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-lightest">
              About
            </h3>
            <p className="mb-4 text-slate">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur.
            </p>
            <p className="mb-4 text-slate">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum. Sed ut perspiciatis
              unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <p className="text-slate">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
              ipsum quia dolor sit amet, consectetur, adipisci velit.
            </p>
          </section>

          <section id="experience" className="mb-24 scroll-mt-24">
            <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-lightest">
              Experience
            </h3>
            <p className="mb-4 text-slate">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
              commodo cursus magna, vel scelerisque nisl consectetur et. Donec
              sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
              dapibus ut facilisis in, egestas eget quam.
            </p>
            <p className="mb-4 text-slate">
              Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
              Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
              Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
              auctor. Aenean lacinia bibendum nulla sed consectetur. Maecenas
              faucibus mollis interdum.
            </p>
            <p className="mb-4 text-slate">
              Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis
              natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus. Donec id elit non mi porta gravida at eget metus.
              Vestibulum id ligula porta felis euismod semper. Fusce dapibus,
              tellus ac cursus commodo, tortor mauris condimentum nibh.
            </p>
            <p className="text-slate">
              Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis
              vestibulum. Etiam porta sem malesuada magna mollis euismod. Cras
              mattis consectetur purus sit amet fermentum. Integer posuere erat a
              ante venenatis dapibus posuere velit aliquet.
            </p>
          </section>

          <section id="projects" className="min-h-screen scroll-mt-24">
            <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-lightest">
              Projects
            </h3>
            <p className="mb-4 text-slate">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              posuere consectetur est at lobortis. Maecenas sed diam eget risus
              varius blandit sit amet non magna. Cras mattis consectetur purus
              sit amet fermentum. Duis mollis, est non commodo luctus, nisi erat
              porttitor ligula, eget lacinia odio sem nec elit.
            </p>
            <p className="mb-4 text-slate">
              Aenean lacinia bibendum nulla sed consectetur. Nullam id dolor id
              nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et
              magnis dis parturient montes, nascetur ridiculus mus. Donec
              ullamcorper nulla non metus auctor fringilla.
            </p>
            <p className="mb-4 text-slate">
              Vestibulum id ligula porta felis euismod semper. Donec sed odio
              dui. Maecenas faucibus mollis interdum. Praesent commodo cursus
              magna, vel scelerisque nisl consectetur et. Nulla vitae elit
              libero, a pharetra augue.
            </p>
            <p className="text-slate">
              Curabitur blandit tempus porttitor. Morbi leo risus, porta ac
              consectetur ac, vestibulum at eros. Fusce dapibus, tellus ac cursus
              commodo, tortor mauris condimentum nibh, ut fermentum massa justo
              sit amet risus. Etiam porta sem malesuada magna mollis euismod.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
