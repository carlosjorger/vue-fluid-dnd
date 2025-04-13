<script lang="ts">
    import { useDragAndDrop } from "fluid-dnd/svelte";
    
    const list = $state([
      {
        id: "1",
        style:
          "margin: 30px 0px !important; border-style: solid; border-width: 0.8rem; padding: 5px;",
        content: "1",
      },
      {
        id: "2",
        style:
          "margin: 20px 0px !important; border-style: solid; border-width: 0.6rem; padding: 10px;",
        content: "2",
      },
      {
        id: "3",
        style:
          "margin: 10px 0px !important; border-style: solid; border-width: 0.4rem; padding: 15px;",
        content: "3",
      },
    ]);
    const [ parent ] = useDragAndDrop(list);
    </script>

  <ul use:parent class="block px-2 h-72">
    {#each list as element, index }
      <li
        class="border-solid pl-1 mt-1 border-2"
        data-index={index}
        style={element.style}
      >
        { element.content }
      </li>
    {/each}
  </ul>