import React from 'react';
import { Toast as Growl } from 'primereact/toast';

let growl: Growl | null = null;
const GrowlContext = React.createContext<{current: Growl}>({current: growl as unknown as Growl});
export default GrowlContext;