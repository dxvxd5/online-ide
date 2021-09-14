import React, { ReactElement, ReactNode } from 'react';
import './App.css';

// defaultProps:
const defaultContainerProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  heading: <strong>My Heading</strong>,
};

type ContainerProps = {
  children: ReactNode;
} & typeof defaultContainerProps;

function Container({ heading, children }: ContainerProps): ReactElement {
  return (
    <div>
      <h1>{heading}</h1>
      {children}
    </div>
  );
}
Container.defaultProps = defaultContainerProps;

// Conventional Props: (If you don't want to support children, but only have a title prop)
function Heading({ title }: { title: string }) {
  return <h1>{title}</h1>;
}

function HeadingWithContent({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <h1>{children}</h1>;
}

// Adds a defaultprop for children
const HeadingFC: React.FC<{ title: string }> = ({ title }) => <h1>{title}</h1>;

// Functional props (i.e. properties)
// with a function property "children"
// that returns back a ReactNode
function TextWithNumber({
  header,
  children,
}: {
  // Make header prop optional:
  // header?: (num: number) => ReactNode;
  header: (num: number) => ReactNode;
  children: (num: number) => ReactNode;
}) {
  const [state, stateSet] = React.useState<number>(1);
  // const [state, stateSet] = React.useState<number | null>(null);

  return (
    <div>
      {/* Conditionally rendered: */}
      {/* {header && <h2>{header?.(state)}</h2>} */}
      <h2>{header(state)}</h2>
      <div>{children(state)}</div>
      <div>
        <button type="button" onClick={() => stateSet(state + 1)}>
          Add
        </button>
      </div>
    </div>
  );
}

// List Component
// Calls render prop on every item prop in the list component
function List<ListItem>({
  items,
  render,
}: // ListItem array is a generic type variable:
{
  items: ListItem[];
  render: (item: ListItem) => ReactNode;
}) {
  return (
    <ul>
      {items.map((item) => (
        <li key={1}>{render(item)}</li>
      ))}
    </ul>
  );
}

function App(): JSX.Element {
  return (
    <div>
      <Heading title="Hello there" />
      <HeadingWithContent>
        <strong>hi!</strong>
      </HeadingWithContent>
      <Container>Foo</Container>
      <HeadingFC title="Hi Again" />
      <TextWithNumber header={(num: number) => <span>Header {num}</span>}>
        {(num: number) => (
          <div>
            {" Today's number is "} {num}
          </div>
        )}
      </TextWithNumber>
      <List
        items={['Jack', 'Sadie', 'Oso']}
        render={(item: string) => <div>{item.toLowerCase()}</div>}
      />
    </div>
  );
}

export default App;
