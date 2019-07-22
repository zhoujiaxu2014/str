import Vue from 'vue'
import { Button } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
import { Message, Header, Container, Aside, Main, MenuItem, Breadcrumb, BreadcrumbItem, Card, Option, Select, Col, Row } from 'element-ui'
import { Submenu } from 'element-ui'
import { Menu } from 'element-ui'
import { MenuItemGroup, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, tree, Cascader, Alert, TabPane, Tabs, Popover } from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Option)
Vue.use(Select)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(tree)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Popover)
    //挂载到全局
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm