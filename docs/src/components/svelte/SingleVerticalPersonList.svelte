<script lang="ts">
  import { useDragAndDrop } from "fluid-dnd/svelte";
  
  const list = $state([
    { number: 1, name: "Carlos", edit: false },
    { number: 2, name: "Jorge", edit: false },
    { number: 3, name: "Ivis", edit: false },
  ]);
  const [ parent ] = useDragAndDrop(list);
  const updatePerson  = (name:string, index:number) => {
    list[index].name = name;
  }
  </script>

  <ul use:parent class="person-list p-8 bg-[var(--sl-color-gray-6)]">
    {#each list as  person, index (person.number) }
      <li class="person" data-index={index}>
        <input type="text" bind:value={person.name} oninput={(e) => updatePerson(e.currentTarget.value, index)} disabled = {!person.edit} />
        <input type="checkbox" bind:checked = {person.edit} />
      </li>
    {/each}
  </ul>
  
  <style>
  .person {
    border-style: solid;
    padding-left: 5px;
    margin-top: 0.25rem;
    border-width: 2px;
    border-color: var(--sl-color-gray-1);
  }
  .person input[type="text"] {
    width: 100px;
    margin: 10px;
  }
  .person-list {
    display: block;
    padding-inline: 25px;
  }
  :global(.temp-child) {
    margin-top: 0 !important;
  }
  </style>
  