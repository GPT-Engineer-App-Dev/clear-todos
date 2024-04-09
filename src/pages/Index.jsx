import React, { useState } from "react";
import { Box, Heading, Input, Button, List, ListItem, ListIcon, IconButton, Flex, Text } from "@chakra-ui/react";
import { FaPlus, FaCheck, FaTrash } from "react-icons/fa";

const Index = () => {
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);

  const handleAddTodo = () => {
    if (todoInput.trim() !== "") {
      setTodos([...todos, { text: todoInput, completed: false }]);
      setTodoInput("");
    }
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const handleRemoveTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <Heading mb={4}>Todo App</Heading>
      <Flex mb={4}>
        <Input value={todoInput} onChange={(e) => setTodoInput(e.target.value)} placeholder="Enter a todo item" mr={2} />
        <Button onClick={handleAddTodo} colorScheme="green" leftIcon={<FaPlus />}>
          Add
        </Button>
      </Flex>
      <List spacing={3}>
        {todos.map((todo, index) => (
          <ListItem key={index} display="flex" alignItems="center">
            <ListIcon as={FaCheck} color={todo.completed ? "green.500" : "gray.300"} cursor="pointer" onClick={() => handleToggleComplete(index)} />
            <Text flex="1" textDecoration={todo.completed ? "line-through" : "none"}>
              {todo.text}
            </Text>
            <IconButton icon={<FaTrash />} colorScheme="red" size="sm" onClick={() => handleRemoveTodo(index)} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Index;
