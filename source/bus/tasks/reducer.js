//Core
import { fromJS } from 'immutable';
// Types
import { type } from './types';
import { dateTime0000 } from '../../instruments';
// Instruments

// const initalState = List();
const initalState = fromJS({
    total_task_count: '5',
    page:             '1',
    sort_direction:   'asc',
    sort_field:       'id',
    tasks:            [
        {
            id:         1,
            username:   'Test User',
            email:      'test_user_1@example.com',
            text:       'Hello, world!',
            status:     10,
            image_path: 'https://uxcandy.com/~shapoval/test-task-backend/upload/user_images/5900dfd7/1508836540_1.jpg',
        },
        {
            id:         3,
            username:   'Test User 2',
            email:      'test_user_2@example.com',
            text:       'Hello from user 2!',
            status:     0,
            image_path: 'https://uxcandy.com/~shapoval/test-task-backend/upload/user_images/5900dfd7/1508836666_3.jpg',
        },
        {
            id:         4,
            username:   'Test User 3',
            email:      'test_user_3@example.com',
            text:       'Hello from user 3!',
            status:     0,
            image_path: 'https://uxcandy.com/~shapoval/test-task-backend/upload/user_images/5900dfd7/1508836803_4.jpg',
        },
    ],
});

export const tasksReducer = (state = initalState, action) => {
    switch (action.type) {
        case type.FILL_TASKS:
            return state.set('tasks', fromJS(action.payload));
        case type.COMPLETE_TASK:
            return state.set('tasks', state.get('tasks').map((task) => {
                if (task.get('id') === action.payload.id) {
                    task = task.set('completed', !task.get('completed'));
                }

                return task;
            }));
        case type.CREATE_TASK:
            return state.set('tasks', state.get('tasks').unshift(fromJS(action.payload)));

        case type.CHANGE_TASK:
            return state.set('tasks', state.get('tasks').map((task) => {
                if (task.get('id') === action.payload.id) {
                    task = task.set('message', action.payload.message);
                }

                return task;
            }));
        case type.CHANGE_PAGE:
            return state.set('page', action.payload);

        case type.SORT_TASK:
            return state.set('sort_field', action.payload);

        case type.SORT_ORDER_TASK:
            return state.set('sort_direction', action.payload);

        case type.SHOW_MODAL_PREVIEW_TASK:
            let newState = state.set('isModalPreviewTask', true);
            let task = {};
            newState
                .get('tasks')
                .filter((t) => t.get('id') === action.payload)
                .map((t) => {
                    task.id = t.get('id');
                    task.username = t.get('username');
                    task.email = t.get('email');
                    task.text = t.get('text');
                    task.status = t.get('status');
                    task.image_path = t.get('image_path');
                });
            newState = newState.set('tempTask', fromJS(task));

            return newState;

        case type.HIDE_MODAL_PREVIEW_TASK:
            return state.delete('isModalPreviewTask');

        case type.SHOW_MODAL_EDIT_TASK:
            let editState = state.set('isModalEditTask', true);
            let editTask = {
                id:         '',
                username:   '',
                email:      '',
                text:       '',
                status:     0,
                image_path: '',
                isValid:    false,
            };
            if (action.payload) {
                editState
                    .get('tasks')
                    .filter((t) => t.get('id') === action.payload)
                    .map((t) => {
                        editTask.id = t.get('id');
                        editTask.username = t.get('username');
                        editTask.email = t.get('email');
                        editTask.text = t.get('text');
                        editTask.status = t.get('status');
                        editTask.image_path = t.get('image_path');
                    });
            }
            editState = editState.set('tempTask', fromJS(editTask));

            return editState;

        case type.NEW_IMAGE:
            console.log(`NEW_IMAGE -> action.payload -> "${action.payload}"`);
            return state.setIn([ 'tempTask', 'image_path' ], action.payload);

        case type.HIDE_MODAL_EDIT_TASK:
            return state.delete('isModalEditTask');

        default:
            return state;
    }
};
