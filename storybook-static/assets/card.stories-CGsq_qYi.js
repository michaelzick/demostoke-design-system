import{j as e}from"./jsx-runtime-6wGy3soA.js";import{C as t,a as d,b as o,c as N,d as i,e as c,B as l}from"./badge-U76o9Kvs.js";import{B as s}from"./button-DFoBBpqX.js";import"./iframe-CwEVEP_C.js";import"./preload-helper-C1FmrZbK.js";const T={title:"UI/Card",component:t,parameters:{layout:"centered",docs:{description:{component:"A flexible card component for displaying content in a structured way."}}},tags:["autodocs"]},r={render:()=>e.jsxs(t,{className:"w-[350px]",children:[e.jsxs(d,{children:[e.jsx(o,{children:"Card Title"}),e.jsx(N,{children:"Card Description"})]}),e.jsx(i,{children:e.jsx("p",{children:"Card content goes here."})}),e.jsx(c,{children:e.jsx(s,{children:"Action"})})]})},a={render:()=>e.jsxs(t,{className:"w-[350px]",children:[e.jsx("div",{className:"w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"}),e.jsxs(d,{children:[e.jsx(o,{children:"Product Card"}),e.jsx(N,{children:"This is a product card with an image placeholder."})]}),e.jsx(i,{children:e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(l,{children:"New"}),e.jsx(l,{variant:"secondary",children:"Featured"})]})}),e.jsxs(c,{className:"flex justify-between",children:[e.jsx(s,{variant:"outline",children:"Learn More"}),e.jsx(s,{children:"Buy Now"})]})]})},n={render:()=>e.jsxs(t,{className:"w-[380px]",children:[e.jsx(d,{children:e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full"}),e.jsx(o,{className:"text-sm",children:"Notification"})]})}),e.jsx(i,{children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"You have a new message from John Doe."})}),e.jsx(c,{children:e.jsx(s,{size:"sm",variant:"ghost",children:"Mark as read"})})]})};var m,u,p;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
}`,...(p=(u=r.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};var C,x,h;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
      <CardHeader>
        <CardTitle>Product Card</CardTitle>
        <CardDescription>
          This is a product card with an image placeholder.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Badge>New</Badge>
          <Badge variant="secondary">Featured</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Learn More</Button>
        <Button>Buy Now</Button>
      </CardFooter>
    </Card>
}`,...(h=(x=a.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};var j,f,g;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <Card className="w-[380px]">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <CardTitle className="text-sm">Notification</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You have a new message from John Doe.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="ghost">
          Mark as read
        </Button>
      </CardFooter>
    </Card>
}`,...(g=(f=n.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};const y=["Default","WithImage","Notification"];export{r as Default,n as Notification,a as WithImage,y as __namedExportsOrder,T as default};
